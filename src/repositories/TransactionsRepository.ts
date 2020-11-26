import { EntityRepository, getRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getRepository(Transaction);

    const transactions = await transactionsRepository.find();

    let sumIncome = 0;
    let sumOutcome = 0;

    if (transactions.length > 0) {
      sumIncome = transactions
        .filter(transaction => transaction.type === 'income')
        .map(transaction => transaction.value)
        .reduce((previous, current) => previous + current, 0);

      sumOutcome = transactions
        .filter(transaction => transaction.type === 'outcome')
        .map(transaction => transaction.value)
        .reduce((previous, current) => previous + current, 0);
    }

    const balance: Balance = {
      income: sumIncome,
      outcome: sumOutcome,
      total: sumIncome - sumOutcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
