gnome-terminal --title=katana --tab -- bash -c 'katana --invoke-max-steps 900000000 --allowed-origins "*" --disable-fee; bash' &&
gnome-terminal --title=sozo --tab -- bash -c "cd onchain && sozo build && sozo migrate apply; bash" &&
gnome-terminal --title=torii --tab -- bash -c 'torii --world 0x43f5a4477cb4fd56a23cf3ccf5172c95bd90caf1ed0813d4989f5e7449d102f --allowed-origins "*"; bash'
