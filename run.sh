gnome-terminal --title=katana --tab -- bash -c 'katana --invoke-max-steps 900000000 --allowed-origins "*" --disable-fee; bash' &&
gnome-terminal --title=sozo --tab -- bash -c "cd onchain && sozo build && sozo migrate apply; bash" &&
gnome-terminal --title=torii --tab -- bash -c 'rm -rf ./tmp/torii && torii --world 0x4ccbc6da0b26ca909183ad69df4cf35b3c8c8492a5a791fd5eda13ce3c55c50 --database ./tmp/torii --allowed-origins "*"; bash'
