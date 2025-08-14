
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://udyamregistration.gov.in/UdyamRegistration.aspx', { waitUntil: 'networkidle2' });
  
  // Extract Step 1 fields
  const step1Fields = await page.evaluate(() => {
    const fields = [];
    document.querySelectorAll('#step1Container input, #step1Container select').forEach(el => {
      fields.push({
        name: el.name,
        type: el.type,
        label: document.querySelector(`label[for="${el.id}"]`)?.innerText || '',
        required: el.required,
        pattern: el.pattern || null,
        options: el.tagName === 'SELECT' ? 
          Array.from(el.options).map(opt => ({ value: opt.value, label: opt.innerText })) 
          : null
      });
    });
    return fields;
  });

  // Extract Step 2 fields
  const step2Fields = await page.evaluate(() => {
    const fields = [];
    document.querySelectorAll('#step2Container input, #step2Container select').forEach(el => {
      fields.push({
        name: el.name,
        type: el.type,
        label: document.querySelector(`label[for="${el.id}"]`)?.innerText || '',
        required: el.required,
        pattern: el.pattern || null,
        options: el.tagName === 'SELECT' ? 
          Array.from(el.options).map(opt => ({ value: opt.value, label: opt.innerText })) 
          : null
      });
    });
    return fields;
  });

  // Save schema
  const formSchema = { step1: step1Fields, step2: step2Fields };
  fs.writeFileSync('form-schema.json', JSON.stringify(formSchema, null, 2));

  console.log('Form schema saved to form-schema.json');
  await browser.close();
})();
