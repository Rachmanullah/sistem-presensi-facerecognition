import { NextResponse } from 'next/server';

const responseHandler = {
    success: (data, message = 'Success', statusCode = 200) => {
        return NextResponse.json({
            status: 'true',
            code: statusCode,
            message,
            data,
        }, { status: statusCode });
    },
    error: (message = 'Error', statusCode = 400) => {
        return NextResponse.json({
            status: 'false',
            code: statusCode,
            message,
        }, { status: statusCode });
    },
    forbidden: (errors = 'Token Required', statusCode = 403) => {
        return NextResponse.json({
            errors,
        }, { status: statusCode });
    },
};

export default responseHandler;
