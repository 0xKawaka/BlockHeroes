gnome-terminal --title=katana --tab -- bash -c 'katana --invoke-max-steps 1000000000 --dev --dev.no-fee --http.cors_origins "*"; bash' &&
gnome-terminal --title=sozo --tab -- bash -c "cd onchain && sozo build && sozo inspect && sozo migrate; bash" &&
gnome-terminal --title=torii --tab -- bash -c 'rm -rf ./tmp/torii && sleep 5 && torii --world 0x02c3ad3cc69e70489c382820f5bd36a54c870742d28341e41f5f04501b36d3e0 --db-dir ./tmp/torii --http.cors_origins "*"; bash'
