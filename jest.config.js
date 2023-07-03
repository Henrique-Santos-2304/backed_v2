module.exports = {
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/shared/**/*.ts",
    "!<rootDir>/src/routes/*.ts",
    "!<rootDir>/src/domain/*.ts",
    "!<rootDir>/src/infra/*.ts",
  ],
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  moduleNameMapper: {
    "@root/(.*)": "<rootDir>/src/$1",
    "@db/(.*)": "<rootDir>/src/infra/$1",
    "@main/(.*)": "<rootDir>/src/main/$1",
    "@composer/(.*)": "<rootDir>/src/main/composers/$1",
    "@repos/(.*)": "<rootDir>/src/infra/repos/$1",
    "@models/(.*)": "<rootDir>/src/infra/models/$1",
    "@data/(.*)": "<rootDir>src/data/$1",
    "@services/(.*)": "<rootDir>/src/services/$1",
    "@usecases/(.*)": "<rootDir>/src/data/usecases/$1",
    "@presenters/(.*)": "<rootDir>/src/presentation/$1",
    "@controllers/(.*)": "<rootDir>/src/presentation/controllers/$1",
    "@shared/(.*)": "<rootDir>src/shared/$1",
    "@core/(.*)": "<rootDir>/src/core/$1",
  },
};
