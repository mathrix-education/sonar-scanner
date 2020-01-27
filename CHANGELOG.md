# Changelog

## Version 1.0.0
- **fixed**: installation if TypeScript will not install all node dependencies anymore
- **changed**: new install directories
    - `/usr/lib/sonar-scanner-cli` on Ubuntu runners (overrides the already installed one)
    - `$HOME/sonar-scanner-cli` on MacOS runners
    - `C:\Program Files\sonar-scanner-cli` on Windows runners
