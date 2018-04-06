#include <bits/stdc++.h>
using namespace std;
#define TAM 100100

char T[TAM];
int sa[TAM], rnk[TAM], pos[TAM], tmp[TAM];
int n, k;

bool cmp_first(int i, int j) { return T[i] < T[j]; }

bool cmp_ranks ( int i, int j ) {
	return make_pair(rnk[pos[i]], i+k<=n?rnk[pos[i+k]]:0)
			 < make_pair(rnk[pos[j]], j+k<=n?rnk[pos[j+k]]:0);
}

int main ( ) {
  scanf ( "%s", T );
  n = strlen(T);

  for ( int i = 0; i <= n; ++i ) sa[i] = i;

	sort ( sa, sa+n+1, cmp_first);
	for ( int i = 0; i < n; ++i )
		rnk[i+1] = rnk[i] + cmp_first(sa[i], sa[i+1]);
	for ( int i = 0; i <= n; ++i ) pos[sa[i]] = i;

  for ( k = 1; rnk[n] != n; k *= 2 ) {
		sort ( sa, sa+n+1, cmp_ranks );
		for ( int i = 0; i < n; ++i )
			tmp[i+1] = tmp[i] + cmp_ranks(sa[i], sa[i+1]);
		memcpy ( rnk, tmp, sizeof(int)*(n+1) );
		for ( int i = 0; i <= n; ++i ) pos[sa[i]] = i;
  }

	printf("\nk = %d\n", k);
	for ( int i = 0; i <= n; ++i ) {
		printf ( "%3d%3d  %s$\n", rnk[i], sa[i], T+sa[i] );
	}
	printf ( "rnk[%d] = %d\n", n, rnk[n] );
	return 0;
}

// alabaralaalabarda

