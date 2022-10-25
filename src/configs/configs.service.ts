import { LOCAL } from './../common/constant';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from 'joi';

export interface EnvConfig {
  [key: string]: string;
}

// export interface FirebaseConfigType {
//   firebaseProjectId: string;
//   firebaseClientEmail: string;
//   firebasePrivateKey: string;
//   firebaseDatabaseUrl: string;
// }

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor() {
    const nodeEnv = process?.env?.NODE_ENV || LOCAL;

    const configFilePath = `environments/.${nodeEnv}.env`;

    const hasEnvFile = fs.existsSync(configFilePath);

    if (!hasEnvFile) {
      throw Error(`environment <${nodeEnv}> file not exists!`);
    }

    const config = dotenv.parse(fs.readFileSync(configFilePath));

    this.envConfig = this.validateInput({
      ...config,
      NODE_ENV: nodeEnv.toLocaleLowerCase(),
    });
  }

  
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      // node env
      NODE_ENV: Joi.string().valid(LOCAL).default(LOCAL),

      // host && port
      INTERNAL_HOST: Joi.string().required(),
      INTERNAL_PORT: Joi.string().required(),

      // typeorm
      TYPEORM_CONNECTION: Joi.string().required(),
      TYPEORM_HOST: Joi.string().required(),
      TYPEORM_USERNAME: Joi.string().required(),
      TYPEORM_PASSWORD: Joi.string().allow('').required(),
      TYPEORM_DATABASE: Joi.string().required(),
      TYPEORM_PORT: Joi.string().required(),
      TYPEORM_SYNCHRONIZE: Joi.string().valid('true', 'false'),
      TYPEORM_SCHEMA: Joi.string().valid('true', 'false'),
      TYPEORM_MIGRATIONS: Joi.string().required(),
      TYPEORM_MIGRATIONS_RUN: Joi.string().valid('true', 'false'),
      TYPEORM_MIGRATIONS_DIR: Joi.string().required(),

      // bcrypt
      BCRYPT_SALT: Joi.number().required(),

      // FIREBASE_PROJECT_ID: Joi.string().required(),
      // FIREBASE_CLIENT_EMAIL: Joi.string().required(),
      // FIREBASE_PRIVATE_KEY: Joi.string().required(),
      // FIREBASE_DATABASE_URL: Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } =
      envVarsSchema.validate(envConfig);

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    // const jwtComfirmSecret = String(validatedEnvConfig.JWT_COMFIRM_SECRET);
    // const jwtSecret = String(validatedEnvConfig.JWT_SECRET);

    // if (jwtComfirmSecret === jwtSecret) {
    //   throw new Error(
    //     'Jwt secret key and jwt comfirm secret key must be different',
    //   );
    // }

    return validatedEnvConfig;
  }

  get nodeEnv(): string {
    return String(this.envConfig.NODE_ENV);
  }

  get internalHost(): string {
    return String(this.envConfig.INTERNAL_HOST);
  }

  get internalPort(): number {
    return Number(this.envConfig.INTERNAL_PORT);
  }

  // get firebaseConfig(): FirebaseConfigType {
  //   return {
  //     firebaseProjectId: String(this.envConfig.FIREBASE_PROJECT_ID),
  //     firebaseClientEmail: String(this.envConfig.FIREBASE_CLIENT_EMAIL),
  //     firebasePrivateKey: String(this.envConfig.FIREBASE_PRIVATE_KEY),
  //     firebaseDatabaseUrl: String(this.envConfig.FIREBASE_DATABASE_URL),
  //   };
  // }

  get databaseConfig() {
    const dbConfig = {
      type: String(this.envConfig.TYPEORM_CONNECTION),
      host: String(this.envConfig.TYPEORM_HOST),
      port: Number(this.envConfig.TYPEORM_PORT),
      username: String(this.envConfig.TYPEORM_USERNAME),
      password: String(this.envConfig.TYPEORM_PASSWORD),
      database: String(this.envConfig.TYPEORM_DATABASE),
      entities: [__dirname + '/../**/*.schema{.ts,.js}'],
      autoSchemaSync: String(this.envConfig.TYPEORM_SCHEMA) === 'true',
      synchronize: String(this.envConfig.TYPEORM_SYNCHRONIZE) === 'true',
      migrations: [String(this.envConfig.TYPEORM_MIGRATIONS)],
      migrationsRun: String(this.envConfig.TYPEORM_MIGRATIONS_RUN) === 'true',
      logging: String(this.envConfig.TYPEORM_LOGGING) === 'true',
      cli: {
        migrationsDir: String(this.envConfig.TYPEORM_MIGRATIONS_DIR),
      },
      enableKeepAlive: true,
    };

    return Object(dbConfig);
  }
}
