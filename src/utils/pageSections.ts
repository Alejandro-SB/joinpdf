import { Ok, Err, type Result } from 'pratica';

type PageSectionGenerator = () => number[];

const singlePageMatcher = /^\d+$/;
const rangeMatcher = /^(\d+)-(\d+)$/;

export const getPageDescriptorFromRawDescriptor = (
  dirtyDescriptor: string,
  totalPages: number
): Result<
  {
    pageIndices: number[];
    raw: string;
  },
  string
> => {
  const descriptor = dirtyDescriptor.replace(/\s/g, '');
  const generators = getGeneratorsFromPageDescriptor(descriptor, totalPages);

  if (generators === null) {
    return Err();
  }

  const firstErr = generators.find((g) => g.isErr());

  if (firstErr) {
    return Err<string>(firstErr.value() as string);
  }

  return Ok({
    pageIndices: generators.flatMap(
      (g) =>
        g
          .cata({
            Ok: (f) => f(),
            Err: (_) => {
              // This should never be called
              throw new Error('Invalid page descriptor');
            }
          })
          .map((n) => n - 1) // To 0-based index
    ),
    raw: descriptor
  });
};

const getGeneratorsFromPageDescriptor = (descriptor: string, totalPages: number) => {
  if (descriptor === '') {
    return null;
  }

  return descriptor
    .replace(/\s/g, '')
    .split(',')
    .map((s) => getGeneratorFromSection(s, totalPages));
};

const getGeneratorFromSection = (
  section: string,
  totalPages: number
): Result<PageSectionGenerator, string> => {
  if (singlePageMatcher.test(section)) {
    const pageNumber = parseInt(section, 10);

    if (pageNumber <= totalPages) {
      return Ok(singlePageSectionGenerator(pageNumber));
    } else {
      return Err(`Página fuera de rango. Total: ${totalPages}, solicitada ${pageNumber}`);
    }
  }

  const [_, fromStr, toStr] = rangeMatcher.exec(section) ?? [];

  if (fromStr && toStr) {
    const from = parseInt(fromStr, 10);
    const to = parseInt(toStr, 10);

    if (from > totalPages || to > totalPages) {
      return Err(
        `Páginas fuera de rango. Total: ${totalPages}, solicitado rango desde ${from} hasta ${to}`
      );
    }

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
