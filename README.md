# bolus-advisor

Bolus insulin calculator for T1D

Based on Bolus Advice from the Accu-Chek Aviva Expert blood glucose meter

Design intended for use on small screens

* * * * *

## Build Procedure
Requires Ruby and `bundler`

Requires NPM with `lite-server` and `concurrently`

Does not specify as dependencies because:

1. This is not an NPM package, *per se*
1. Windows doesn't appreciate NPM's super deep folders

`npm start` starts `jekyll` in watch mode, and `lite-server` to preview

Deploys to Github Pages
