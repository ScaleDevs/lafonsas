import { useEffect, useState } from 'react';
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs';

const Elipse = () => {
  return <div className='h-10 w-[35px] bg-gray-200 flex justify-center items-end'>&hellip;</div>;
};

const ArrowClick = ({ children, callback }: { children: any; callback: any }) => {
  return (
    <div
      className='h-10 w-[35px] bg-gray-200 flex items-center justify-center rounded-sm hover:cursor-pointer hover:bg-gray-100'
      onClick={() => callback()}
    >
      {children}
    </div>
  );
};

export interface IPaginatorProps {
  currentPage: number;
  pageCount: number;
  handlePageChange: (pageNumber: number) => void;
}

export default function Paginator({ currentPage, pageCount, handlePageChange }: IPaginatorProps) {
  const [lowerLimit, setLowerLimit] = useState(1);
  const [higherLimit, setHigherLimit] = useState(5);

  useEffect(() => {
    let pageForLowerLimit = currentPage;
    let pageForHigherLimit = currentPage;

    do {
      pageForLowerLimit -= 1;
    } while (pageForLowerLimit % 5 !== 0);

    do {
      if (pageForHigherLimit % 5 !== 0) pageForHigherLimit += 1;
    } while (pageForHigherLimit % 5 !== 0);

    setLowerLimit(pageForLowerLimit + 1);
    setHigherLimit(pageForHigherLimit);
  }, [currentPage]);

  return (
    <div className='flex space-x-2'>
      {currentPage > 1 && (
        <ArrowClick callback={() => handlePageChange(currentPage - 1)}>
          <BsChevronLeft />
        </ArrowClick>
      )}
      {lowerLimit > 1 && <Elipse />}
      {Array(pageCount)
        .fill(1)
        .map((v, i) => {
          const currentIteration = v + i;

          if (currentIteration >= lowerLimit && currentIteration <= higherLimit)
            return (
              <div
                key={i}
                className={`h-10 w-[35px] ${
                  currentPage === i + 1
                    ? 'bg-green-700 text-white hover:bg-green-600'
                    : 'bg-gray-200 text-black hover:bg-gray-400'
                } rounded-sm overflow-hidden hover:cursor-pointer`}
                onClick={() => handlePageChange(currentIteration)}
              >
                <div className='h-[100%] flex justify-center items-center'>{currentIteration}</div>
              </div>
            );
          return '';
        })}
      {pageCount > higherLimit && <Elipse />}
      {currentPage < pageCount && (
        <ArrowClick callback={() => handlePageChange(currentPage + 1)}>
          <BsChevronRight />
        </ArrowClick>
      )}
    </div>
  );
}
