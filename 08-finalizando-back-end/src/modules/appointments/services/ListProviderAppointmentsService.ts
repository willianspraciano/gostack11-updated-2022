import { injectable, inject } from 'tsyringe';

import { Appointment } from '../infra/typeorm/entities/Appointment';
import { IAppointmentsRepository } from '../repositories/IAppointmentsRepository';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { instanceToInstance } from 'class-transformer';

interface IRequestDTO {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
export class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequestDTO): Promise<Appointment[]> {
    const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

    let appointments = await this.cacheProvider.recover<Appointment[]>(
      cacheKey,
    );

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllInDayFromProvider(
        {
          provider_id,
          year,
          month,
          day,
        },
      );

      await this.cacheProvider.save(cacheKey, instanceToInstance(appointments));
    }

    return appointments;
  }
}
