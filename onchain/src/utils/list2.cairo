use core::option::OptionTrait;
use core::result::ResultTrait;
use core::poseidon::poseidon_hash_span;
use core::traits::DivRem;
use starknet::storage_access::{
    Store, StorageBaseAddress, storage_address_from_base, storage_base_address_from_felt252
};
use starknet::{SyscallResult, SyscallResultTrait};

const POW2_8: u32 = 256; // 2^8

#[derive(Drop)]
pub struct List<T> {
    pub(crate) address_domain: u32,
    pub(crate) base: StorageBaseAddress,
    len: u32, // number of elements in array
}

pub trait ListTrait<T> {
    fn new(address_domain: u32, base: StorageBaseAddress) -> List<T>;
    fn fetch(address_domain: u32, base: StorageBaseAddress) -> SyscallResult<List<T>>;
    fn append_span(ref self: List<T>, span: Span<T>) -> SyscallResult<()>;
    fn len(self: @List<T>) -> u32;
    fn is_empty(self: @List<T>) -> bool;
    fn append(ref self: List<T>, value: T) -> SyscallResult<u32>;
    fn get(self: @List<T>, index: u32) -> SyscallResult<Option<T>>;
    fn set(ref self: List<T>, index: u32, value: T) -> SyscallResult<()>;
    fn remove(ref self: List<T>, index: u32);
    fn clean(ref self: List<T>);
    fn pop_front(ref self: List<T>) -> SyscallResult<Option<T>>;
    fn array(self: @List<T>) -> SyscallResult<Array<T>>;
    fn storage_size(self: @List<T>) -> u8;
}

impl ListImpl<T, +Copy<T>, +Drop<T>, +Store<T>> of ListTrait<T> {
    #[inline(always)]
    fn new(address_domain: u32, base: StorageBaseAddress) -> List<T> {
        List { address_domain, base, len: 0 }
    }

    #[inline(always)]
    fn fetch(address_domain: u32, base: StorageBaseAddress) -> SyscallResult<List<T>> {
        ListStore::read(address_domain, base)
    }

    fn append_span(ref self: List<T>, mut span: Span<T>) -> SyscallResult<()> {
        let mut index = self.len;
        self.len += span.len();
        let storage_size = self.storage_size();
        loop {
            match span.pop_front() {
                Option::Some(v) => {
                    let (base, offset) = calculate_base_and_offset_for_index(
                        self.base, index, storage_size
                    );
                    match Store::write_at_offset(self.address_domain, base, offset, *v) {
                        Result::Ok(_) => {},
                        Result::Err(e) => { break Result::Err(e); }
                    }
                    index += 1;
                },
                Option::None => { break Store::write(self.address_domain, self.base, self.len); }
            };
        }
    }

    #[inline(always)]
    fn len(self: @List<T>) -> u32 {
        *self.len
    }

    #[inline(always)]
    fn is_empty(self: @List<T>) -> bool {
        *self.len == 0
    }

    fn append(ref self: List<T>, value: T) -> SyscallResult<u32> {
        let (base, offset) = calculate_base_and_offset_for_index(
            self.base, self.len, self.storage_size()
        );
        Store::write_at_offset(self.address_domain, base, offset, value)?;

        let append_at = self.len;
        self.len += 1;
        Store::write(self.address_domain, self.base, self.len)?;

        Result::Ok(append_at)
    }

    fn get(self: @List<T>, index: u32) -> SyscallResult<Option<T>> {
        if (index >= *self.len) {
            return Result::Ok(Option::None);
        }

        let (base, offset) = calculate_base_and_offset_for_index(
            *self.base, index, self.storage_size()
        );
        let t = Store::read_at_offset(*self.address_domain, base, offset)?;
        Result::Ok(Option::Some(t))
    }

    fn set(ref self: List<T>, index: u32, value: T) -> SyscallResult<()> {
        assert(index < self.len, 'List index out of bounds');
        let (base, offset) = calculate_base_and_offset_for_index(
            self.base, index, self.storage_size()
        );
        Store::write_at_offset(self.address_domain, base, offset, value)
    }

    fn remove(ref self: List<T>, index: u32) {
        assert(index < self.len, 'List index out of bounds');
        assert(self.len > 0, 'List is empty');

        if(index == self.len - 1) {
            self.len -= 1;
            Store::write(self.address_domain, self.base, self.len).unwrap_syscall();
            return;
        }

        let popped = self.get(self.len - 1).unwrap_syscall().unwrap();
        self.len -= 1;
        Store::write(self.address_domain, self.base, self.len).unwrap_syscall();
        self.set(index, popped).unwrap_syscall();
    }

    #[inline(always)]
    fn clean(ref self: List<T>) {
        self.len = 0;
        Store::write(self.address_domain, self.base, self.len).unwrap_syscall();
    }

    fn pop_front(ref self: List<T>) -> SyscallResult<Option<T>> {
        if self.len == 0 {
            return Result::Ok(Option::None);
        }

        let popped = self.get(self.len - 1)?;
        // not clearing the popped value to save a storage write,
        // only decrementing the len - makes it unaccessible through
        // the interfaces, next append will overwrite the values
        self.len -= 1;
        Store::write(self.address_domain, self.base, self.len)?;

        Result::Ok(popped)
    }

    fn array(self: @List<T>) -> SyscallResult<Array<T>> {
        let mut array = array![];
        let mut index = 0;
        let result: SyscallResult<()> = loop {
            if index == *self.len {
                break Result::Ok(());
            }
            let value = match self.get(index) {
                Result::Ok(v) => v,
                Result::Err(e) => { break Result::Err(e); }
            }.expect('List index out of bounds');
            array.append(value);
            index += 1;
        };

        match result {
            Result::Ok(_) => Result::Ok(array),
            Result::Err(e) => Result::Err(e)
        }
    }

    fn storage_size(self: @List<T>) -> u8 {
        Store::<T>::size()
    }
}

impl AListIndexViewImpl<T, +Copy<T>, +Drop<T>, +Store<T>> of IndexView<List<T>, u32, T> {
    fn index(self: @List<T>, index: u32) -> T {
        self.get(index).expect('read syscall failed').expect('List index out of bounds')
    }
}

// this functions finds the StorageBaseAddress of a "storage segment" (a continuous space of 256 storage slots)
// and an offset into that segment where a value at `index` is stored
// each segment can hold up to `256 // storage_size` elements
//
// the way how the address is calculated is very similar to how a LegacyHash map works:
//
// first we take the `list_base` address which is derived from the name of the storage variable
// then we hash it with a `key` which is the number of the segment where the element at `index` belongs (from 0 upwards)
// we hash these two values: H(list_base, key) to the the `segment_base` address
// finally, we calculate the offset into this segment, taking into account the size of the elements held in the array
//
// by way of example:
//
// say we have an List<Foo> and Foo's storage_size is 8
// struct storage: {
//    bar: List<Foo>
// }
//
// the storage layout would look like this:
//
// segment0: [0..31] - elements at indexes 0 to 31
// segment1: [32..63] - elements at indexes 32 to 63
// segment2: [64..95] - elements at indexes 64 to 95
// etc.
//
// where addresses of each segment are:
//
// segment0 = hash(bar.address(), 0)
// segment1 = hash(bar.address(), 1)
// segment2 = hash(bar.address(), 2)
//
// so for getting a Foo at index 90 this function would return address of segment2 and offset of 26

fn calculate_base_and_offset_for_index(
    list_base: StorageBaseAddress, index: u32, storage_size: u8
) -> (StorageBaseAddress, u8) {
    let max_elements = POW2_8 / storage_size.into();
    let (key, offset) = DivRem::div_rem(index, max_elements.try_into().unwrap());

    // hash the base address and the key which is the segment number
    let addr_elements = array![storage_address_from_base(list_base).into(), key.into()];
    let segment_base = storage_base_address_from_felt252(poseidon_hash_span(addr_elements.span()));

    (segment_base, offset.try_into().unwrap() * storage_size)
}

impl ListStore<T, +Store<T>> of Store<List<T>> {
    fn read(address_domain: u32, base: StorageBaseAddress) -> SyscallResult<List<T>> {
        let len: u32 = Store::read(address_domain, base).unwrap_syscall();
        Result::Ok(List { address_domain, base, len })
    }

    #[inline(always)]
    fn write(address_domain: u32, base: StorageBaseAddress, value: List<T>) -> SyscallResult<()> {
        Store::write(address_domain, base, value.len)
    }

    fn read_at_offset(
        address_domain: u32, base: StorageBaseAddress, offset: u8
    ) -> SyscallResult<List<T>> {
        let len: u32 = Store::read_at_offset(address_domain, base, offset).unwrap_syscall();
        Result::Ok(List { address_domain, base, len })
    }

    #[inline(always)]
    fn write_at_offset(
        address_domain: u32, base: StorageBaseAddress, offset: u8, value: List<T>
    ) -> SyscallResult<()> {
        Store::write_at_offset(address_domain, base, offset, value.len)
    }

    fn size() -> u8 {
        Store::<u8>::size()
    }
}