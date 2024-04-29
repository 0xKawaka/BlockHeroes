gnome-terminal --title=katana --tab -- bash -c "katana --disable-fee --invoke-max-steps 9000000; bash" && gnome-terminal --title=deploy --tab -- bash -c "cd onchain && sozo migrate; bash"
