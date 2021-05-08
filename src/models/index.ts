/** @module app/data */

import { createSequelize } from '../clients/sequelize';

export async function setup() {
  await createSequelize();
}
