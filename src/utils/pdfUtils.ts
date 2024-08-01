import type { InputPdfFile } from '@/components/FileContainer.vue';
import { PDFDocument } from 'pdf-lib';
import type { PDFDocumentProxy } from 'pdfjs-dist';

export const getTotalPages = async (file: File) => {
  const pdfDocument = await getDocumentFromFile(file);

  return pdfDocument.getPageCount();
};

export const createThumbnail = async (pdfDocument: PDFDocumentProxy) => {
  const page = await pdfDocument.getPage(1);
  // draw page to fit into 96x96 canvas
  const vp = page.getViewport({
    scale: 1
  });
  const canvas = document.createElement('canvas');
  canvas.height = 297;
  canvas.width = 210;
  const scale = Math.min(canvas.width / vp.width, canvas.height / vp.height);

  await page.render({
    canvasContext: canvas.getContext('2d')!,
    viewport: page.getViewport({
      scale
    })
  }).promise;

  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!));
  });

  return URL.createObjectURL(blob);
};

export const mergeDocuments = async (inputFiles: InputPdfFile[]) => {
  const newPdf = await PDFDocument.create();
  newPdf.setProducer('joinpdf');
  newPdf.setCreator('joinPDF');
  newPdf.setCreationDate(new Date());

  for (const pdfFile of inputFiles) {
    const doc = await getDocumentFromFile(pdfFile.file);

    const indices = pdfFile.descriptor?.pageIndices ?? doc.getPageIndices();

    const copiedPages = await newPdf.copyPages(doc, indices);

    copiedPages.forEach((p) => newPdf.addPage(p));
  }

  const newDocArray = await newPdf.save();
  const blob = new Blob([newDocArray], {
    type: 'application/pdf'
  });

  return blob;
};

const getDocumentFromFile = async (file: File) => {
  const ab = await file.arrayBuffer();
  const u8a = new Uint8Array(ab);
  const doc = await PDFDocument.load(u8a, {
    ignoreEncryption: true
  });

  return doc;
};
