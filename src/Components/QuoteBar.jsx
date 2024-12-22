import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import QuoteService from '../Appwrite/Quote';
import { setQuote } from '../store/QuoteSlice';

const QuoteBar = () => {
    const dispatch = useDispatch();
    const quote = useSelector((state) => state.TodayQuote.value);
    const isFetched = useSelector((state) => state.TodayQuote.isFetched);

    useEffect(() => {
        if (!isFetched) {
            const fetchQuote = async () => {
                try {
                    const QoD = await QuoteService.getTodaysQuote();
                    if (QoD.documents && QoD.documents.length > 0) {
                        dispatch(setQuote(QoD.documents[0].Quote || 'No quote available for today.'));
                    } else {
                        dispatch(setQuote('No quote available for today.'));
                    }
                } catch (error) {
                    console.error('Error fetching the quote:', error);
                    dispatch(setQuote('Failed to fetch the quote.'));
                }
            };

            fetchQuote();
        }
    }, [dispatch, isFetched]);

    return (
        <div className="bg-zinc-200 w-[100vw] text-center text-sm">
            <p className="italic">Quote of the day : "{quote}"</p>
        </div>
    );
};

export default QuoteBar;
