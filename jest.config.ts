import { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
    verbose: true,
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    // 串行执行所有测试，而不是并行执行
    // runInBand: true,
    // 禁用测试并行化
    maxWorkers: 1,
    // setupFilesAfterEnv: ['./jest.setup.ts'], // Replace with your test setup file name and path
    // "reporters": [
    //     "default",
    //     ["./node_modules/jest-html-reporter", {
    //         "pageTitle": "Test Report"
    //     }]
    // ],
    testTimeout:1000000,
};

export default config;