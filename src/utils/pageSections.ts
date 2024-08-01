import { Ok, Err, type Result } from 'pratica';

type PageSectionGenerator = () => number[];

const singlePageMatcher = /^\d+$/;
const rangeMatcher = /^(\d+)-(\d+)$/;

export const getGeneratorsFromPageDescriptor = (descriptor: string) => {
  if (descriptor === '') {
    return null;
  }

  return descriptor.replace(/\s/g, '').split(',').map(getGeneratorFromSection);
};

export const getPageNumbersFromDescriptor = (descriptor: string) => {
  const generators = getGeneratorsFromPageDescriptor(descriptor);

  if (generators === null) {
    throw new Error('Invalid page descriptor');
  }

  return generators.flatMap((g) =>
    g.cata({
      Ok: (f) => f(),
      Err: (_) => {
        throw new Error('Invalid page descriptor-');
      }
    })
  );
};

const getGeneratorFromSection = (section: string): Result<PageSectionGenerator, string> => {
  if (singlePageMatcher.test(section)) {
    const pageNumber = parseInt(section, 10);
    return Ok(singlePageSectionGenerator(pageNumber));
  }

  const [_, fromStr, toStr] = rangeMatcher.exec(section) ?? [];

  if (fromStr && toStr) {
    const from = parseInt(fromStr, 10);
    const to = parseInt(toStr, 10);

    if (from < to) {
      return Ok(pageRangeGenerator(from, to));
    }
  }

  return Err(`El segmento '${section}' no es válido`);
};

const singlePageSectionGenerator =
  (pageNumber: number): PageSectionGenerator =>
  () => [pageNumber];

const pageRangeGenerator =
  (fromPage: number, toPage: number): PageSectionGenerator =>
  () =>
    arrayRange(fromPage, toPage);

const arrayRange = (from: number, to: number, step: number = 1) =>
  Array.from({ length: (to - from) / step + 1 }, (_, index) => from + index * step);
