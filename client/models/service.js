import { makeVar } from '@apollo/client';
import React from 'react';

export const getAddressVar = makeVar(!!localStorage.getItem('getAddress'));
export const isFinderVar = makeVar(!!localStorage.getItem('isFinder'));
export const isBrainerVar = makeVar(!!localStorage.getItem('isBrainer'));
export const isWiseVar = makeVar(!!localStorage.getItem('isWise'));

export const rolesReactive = (address, isFinder, isBrainer, isWise) => {
	console.log(address);
	getAddressVar(address);
	isFinderVar(isFinder);
	isBrainerVar(isBrainer);
	isWiseVar(isWise);
}