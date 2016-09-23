
ROOT=$(pwd)

# Compile the card module
cd $ROOT/cards
npm install

cd $ROOT/web
npm install &
npm link ../cards &

echo "Installed dependencies... deploy your solution from sphinx."
