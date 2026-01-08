

export default function renderTemplate(templateContent, dataToReplace) {

    for (const attribute in dataToReplace) {
      const key = new RegExp(`\\{\\{\\s*${attribute}\\s*\\}\\}`, 'g');
      templateContent = templateContent.replace(key, dataToReplace[attribute]);
    }
  console.log('+++++', templateContent);
  return templateContent;
}