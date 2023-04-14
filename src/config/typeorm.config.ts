import { TypeOrmModuleOptions } from "@nestjs/typeorm";

// Local database:  
export const TypeOrmConfig : TypeOrmModuleOptions = {
    type : "postgres",
    host: "localhost",
    port : 5432,
    username : "postgres",
    password : "postgres",
    database : "nftmarketplace",
    entities : [__dirname + '/../**/*.entity.{js,ts}'],    
    // entities : [Task],    
    synchronize : true 
}


// Hosted database in render:
// export const TypeOrmConfig : TypeOrmModuleOptions = {
//     type : "postgres",
//     // url: "postgres://ocnft:azPIXPvxfuzTyS0wA9XA7BbOjMCL5QDr@dpg-cgika5ndvk4vd542j1v0-a/nftmarketplace",
//     url: "postgres://ocnft:azPIXPvxfuzTyS0wA9XA7BbOjMCL5QDr@dpg-cgika5ndvk4vd542j1v0-a.oregon-postgres.render.com/nftmarketplace",
//     port : 5432,
//     username : "ocnft",
//     password : "azPIXPvxfuzTyS0wA9XA7BbOjMCL5QDr",
//     database : "nftmarketplace",
//     entities : [__dirname + '/../**/*.entity.{js,ts}'],    
//     // entities : [Task],    
//     synchronize : false,
//     extra: {
//         ssl: {
//             rejectUnauthorized: false
//         }
//     }
// }
