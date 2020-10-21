#include <iostream>
#include <cstdlib>
#include <stdio.h>
using namespace std;


long long int prev(long long int i,long long int n,long long int shift){
	if( (i-shift) >= 1) return ( i-shift );
	return n + (i - shift);
}

long long int val(long long int index, int k){
	if(index<k) return index;
	return (index+(index-k)/(k-1) + 1);
}

int short_prev(int i,int n,int shift){
	if( (i-shift) >= 1) return ( i-shift );
	return n + (i - shift);
}

int short_val(int index, int removed){
	if(index>=removed) return index+1;
	return index;
}

long long int J(long long int n, int k){
	if( n == 1 ) return 1;
	if( n < k ){
		int removed;
		if(k%n==0) removed=n;
		else removed=k%n;
		return short_val(short_prev(J(n-1,k),n-1,n-removed), removed);
	}
	return val(prev(J(n-n/k,k), n-n/k, n%k),k);
}

int main(){
	long long int n;
	int k;
	cin>>n>>k;
	cout<< J(n,k);
	
}
