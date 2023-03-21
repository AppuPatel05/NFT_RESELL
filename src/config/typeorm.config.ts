import { TypeOrmModuleOptions } from "@nestjs/typeorm";
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