import fs from 'fs';

try {
  const auth = JSON.parse(fs.readFileSync('auth.json', 'utf8'));
  const origin = auth.origins.find(o => o.origin.includes('releases-iastracking'));
  
  if (!origin) {
    console.log("ERROR_ORIGEN");
    process.exit(1);
  }

  // BUSCAMOS EL ID TOKEN, NO EL ACCESS TOKEN
  const tokenData = origin.localStorage.find(l => l.name.includes('idToken'));
  
  if (tokenData) {
    console.log(tokenData.value);
  } else {
    console.log("ERROR_TOKEN");
  }
} catch (error) {
  console.log("ERROR_LECTURA");
}