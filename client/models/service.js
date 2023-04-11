import { makeVar } from '@apollo/client';
import React from 'react';


export const getAddressVar = typeof window !== "undefined" ?  makeVar(localStorage.getItem('getAddress')) : makeVar(null);
export const isFinderVar = typeof window !== "undefined" ?  makeVar(localStorage.getItem('isFinder') === 'true') : makeVar(false);
export const isBrainerVar = typeof window !== "undefined" ?  makeVar(localStorage.getItem('isBrainer') === 'true') : makeVar(false);
export const isWiseVar = typeof window !== "undefined" ?  makeVar(localStorage.getItem('isWise') === 'true') : makeVar(false);

export const rolesReactive = (address, isFinder, isBrainer, isWise) => {
	localStorage.setItem('getAddress', address);
	localStorage.setItem('isFinder', isFinder);
	localStorage.setItem('isBrainer', isBrainer);
	localStorage.setItem('isWise', isWise);
	getAddressVar(address);
	isFinderVar(isFinder);
	isBrainerVar(isBrainer);
	isWiseVar(isWise);
}