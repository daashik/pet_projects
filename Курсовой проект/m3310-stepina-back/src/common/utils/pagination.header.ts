import { Response } from 'express';

export function setPaginationHeader(
  res: Response, 
  total: number, 
  skip: number, 
  take: number, 
  baseUrl: string
) {
  const links: string[] = []; 
  const currentSkip = Number(skip) || 0;
  const currentTake = Number(take) || 10;

  // 1. ссылка на следующую страницу
  if (currentSkip + currentTake < total) {
    links.push(`<${baseUrl}?skip=${currentSkip + currentTake}&take=${currentTake}>; rel="next"`);
  }

  // 2. ссылка на предыдущую страницу
  if (currentSkip > 0) {
    const prevSkip = Math.max(0, currentSkip - currentTake);
    links.push(`<${baseUrl}?skip=${prevSkip}&take=${currentTake}>; rel="prev"`);
  }

  // 3. заголовок HATEOAS
  if (links.length > 0) {
    res.setHeader('Link', links.join(', '));
  }

  // 4. общее количество записей
  res.setHeader('X-Total-Count', total.toString());

  // 5. чтение заголовков
  res.setHeader('Access-Control-Expose-Headers', 'Link, X-Total-Count');
}