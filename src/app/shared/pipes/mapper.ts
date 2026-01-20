import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

export type CdkMapper<T extends unknown[], G> = (...args: T) => G;

@Pipe({
    standalone: true,
    name: 'mapper',
})
export class MapperPipe implements PipeTransform {
    transform<T extends unknown[], U, G>(value: U, mapper: CdkMapper<[U, ...T], G>, ...args: T): G {
        return mapper(value, ...args);
    }
}
