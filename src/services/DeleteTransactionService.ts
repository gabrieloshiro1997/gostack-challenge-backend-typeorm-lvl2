import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const transactionFound = await transactionRepository.findOne(id);

    if (!transactionFound) {
      throw new AppError('Transaction not found', 400);
    }

    await transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
