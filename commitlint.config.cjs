module.exports = {
  extends: ['@commitlint/config-conventional'],
  formatter: '@commitlint/format',
  rules: {
    'type-enum': [
      2,
      'always',
      ['fix', 'feat', 'test', 'chore', 'docs', 'refactor', 'style']
    ],
    'type-case': [2, 'always', 'lower-case'], // 允许type小写校验
    'type-empty': [2, 'never'], // 不允许type为空
    'scope-empty': [0], // 允许scope为空
    'subject-full-stop': [0, 'never'],
    'subject-case': [2, 'always', 'lower-case'],
    'header-max-length': [0, 'always', 72]
  }
}