import { Command } from 'commander';
import * as inquirer from 'inquirer';

import { sequelize } from '../clients';
import { setup as setupData } from '../models';
import { User } from '../models/user';

const program = new Command()
const pkg = require('../../package');

interface IArgs {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

program
  .version(pkg.version)
  .option('-e, --email <email>', 'email address')
  .option('-p, --password <password>', 'password')
  .option('-f, --first-name <name>', 'first name')
  .option('-l, --last-name <name>', 'last name')
  .option('-r, --role <role>', 'role (student/ staff / admin)');

async function prompt() {
  return await inquirer.prompt([
    {
      name: 'email',
      type: 'input',
      when: !program.opts().email,
    },
    {
      name: 'password',
      type: 'password',
      when: !program.opts().password,
    },
    {
      name: 'firstName',
      type: 'input',
      message: 'first name',
      when: !program.opts().firstName,
    },
    {
      name: 'lastName',
      type: 'input',
      message: 'last name',
      when: !program.opts().lastName,
    },
    {
      name: 'role',
      type: 'list',
      choices: ['admin', 'student', 'staff'],
      when: !program.opts().role,
    },
  ]);
}

async function createUser(args: IArgs) {
  return await sequelize.$.transaction(function(transaction) {
    return User.create(
      {
        email: args.email,
        passwordHash: args.password,
        role: args.role || 'student',
        firstName: args.firstName,
        lastName: args.lastName,
      } as User,
      { transaction },
    );
  });
}

async function main() {
  program.parse(process.argv);
  const promptAnswers = await prompt();
  const args: IArgs = Object.assign({}, promptAnswers, program) as any;

  await setupData();

  const user = await createUser(args);
  console.log('user created with id %s', user.id);

  process.exit();
}

if (require.main === module) {
  main();
}
