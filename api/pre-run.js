const checkversion = require('./tools/checkversion')

const running = process.version;

const version_check = checkversion(running);

if(version_check.status==1){
    console.log(`You are running Node ${running} as expected.`);    
}else if(version_check.status==0){
    console.error(
        `You are running Node ${running} but version ${desired} is expected. ` + 
        `Use nvm or another version manager to install ${desired}, and then activate it.`
    );
    process.exit(1);
}else if(version_check.status=='error'){
    console.error(`Version check failed. Check logs and try again.`);
    process.exit(1);
}