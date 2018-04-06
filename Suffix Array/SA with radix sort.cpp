#include <bits/stdc++.h>
using namespace std;

const int TAM = 300100;
const int RADIX_TAM = TAM*2;

int radixCnt[RADIX_TAM];
//lo <= values[i] <= hi && 0 <= order[i] < n
void radixPass ( int* order, int* newOrder, int* values, int n, int lo, int hi ) {
	int i; lo--;
	for ( i = lo; i <= hi; ++i ) radixCnt[i-lo] = 0;
	for ( i = 0; i < n; ++i ) radixCnt[values[i]-lo]++;
	for ( i = lo; i < hi; ++i ) radixCnt[i-lo+1] += radixCnt[i-lo];
	for ( i = 0; i < n; ++i )
		newOrder[radixCnt[values[order[i]]-1-lo]++] = order[i];
}

namespace SA
{
	int aux[TAM];

	//s[n] should be different (normally '\0' would do)
	void build ( int* sa, int* lcp, int* pos, char* s, const int n  )
	{
		for ( int i = 0; i < n; ++i )
			pos[i] = int(s[i]), sa[i]=i;
		radixPass ( sa, lcp, pos, n, 0, 1<<8 );
		memcpy ( sa, lcp, sizeof(int)*n );

		for ( int k = 1; ; k <<= 1 )
		{
			for ( int i = n-1; i >= 0; --i )
				aux[i] = ( i+k < n ? pos[i+k] : -(i+1) );
			radixPass ( sa, lcp, aux, n, -n, (k==1?1<<8:n-1) );
			radixPass ( lcp, sa, pos, n, 0, (k==1?1<<8:n-1) );

			lcp[0] = 0;
			for ( int i = 1, cur, prv; i < n; ++i ) {
				cur=sa[i]; prv=sa[i-1];
				lcp[i] = lcp[i-1];
				if ( pos[cur] != pos[prv] ) lcp[i]++;
				else if ( cur+k >= n || prv+k >= n ) lcp[i]++;
				else lcp[i] += ( pos[cur+k] > pos[prv+k] ? 1 : 0 );
			}
			for ( int i = 0; i < n; ++i ) pos[sa[i]] = lcp[i];

			if ( pos[sa[n-1]] == n-1 ) break;
		}

		lcp[n-1] = 0;
		for ( int i = 0, ii, lo = 0; i < n; i++ ) {
			if ( pos[i]+1 == n ) continue;
			for ( ii=sa[pos[i]+1]; s[i+lo] == s[ii+lo]; lo++ );
			lcp[pos[i]]=lo;
			if(lo) lo--;
		}
	}
}

char T[TAM];
int sa[TAM], lcp[TAM], pos[TAM];
int n;

int main ( ) {
  scanf ( "%s", T );
  n = strlen(T);
  SA::build(sa,lcp,pos,T,n);


	for ( int i = 0; i <= n; ++i ) {
		printf ( "%3d%3d  %s$\n", lcp[i], sa[i], T+sa[i] );
	}
	return 0;
}

// alabaralaalabarda
