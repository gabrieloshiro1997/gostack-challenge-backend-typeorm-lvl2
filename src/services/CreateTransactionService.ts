import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';
// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';

enum TransactionType {
  INCOME = 'income',
  OUTCOME = 'outcome',
}
interface Request {
  title: string;
  value: number;
  type: string;
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionRepository);
    const categoriesRepository = getRepository(Category);

    if (type !== TransactionType.INCOME && type !== TransactionType.OUTCOME) {
      throw new AppError('Type not allowed.');
    }

    const { total } = await transactionsRepository.getBalance();

    if (total <= value && type === TransactionType.OUTCOME) {
      throw new AppError('Insufficient funds', 400);
    }

    const categoryFound = await categoriesRepository.findOne({
      where: {
        title: category,
      },
    });

    let newCategory: Category;
    if (!categoryFound) {
      newCategory = categoriesRepository.create({
        title: category,
      });

      newCategory = await categoriesRepository.save(newCategory);
    } else {
      newCategory = categoryFound;
    }

    let newTransaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: newCategory.id,
    });

    newTransaction = await transactionsRepository.save(newTransaction);

    return newTransaction;
  }
}

export default CreateTransactionService;
