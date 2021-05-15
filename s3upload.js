const dotenv = require('dotenv');
const s3SpaUpload = require('s3-spa-upload').default;

dotenv.config({
  path: `./.env.production.local`
});

if (!process.env.AWS_ACCESS_KEY_ID) {
  console.error('process.env.AWS_ACCESS_KEY_ID is empty');
  return;
}
if (!process.env.AWS_SECRET_ACCESS_KEY) {
  console.error('process.env.AWS_SECRET_ACCESS_KEY is empty');
  return;
}
if (!process.env.AWS_BUCKET_NAME) {
  console.error('process.env.AWS_BUCKET_NAME is empty');
  return;
}

console.log('AWS_ACCESS_KEY_ID', process.env.AWS_ACCESS_KEY_ID);
console.log('AWS_SECRET_ACCESS_KEY', process.env.AWS_SECRET_ACCESS_KEY);
console.log('AWS_BUCKET_NAME', process.env.AWS_BUCKET_NAME);

const options = {
  delete: true,
  gzip: true,
  cacheControlMapping: {
    'index.html': 'no-cache',
    '*.js': 'public,max-age=31536000,immutable',
    '*.map': 'public,max-age=31536000,immutable',
    '*.css': 'public,max-age=31536000,immutable'
  },
  awsCredentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
};

s3SpaUpload('build', process.env.AWS_BUCKET_NAME, options).catch(console.error);