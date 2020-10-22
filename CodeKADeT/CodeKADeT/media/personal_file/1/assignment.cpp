#include<bits/stdc++.h>
using namespace std;
typedef long long int ll;
int main(){
    ll n;
    freopen("input2", "r", stdin);
    freopen("out", "w", stdout);
    cin>>n;
    int* f=new int[n];
     for(int i=0; i<n; i++) cin>>f[i];
    //part A;
    ll* ans=new ll [n];
    ll* range_left=new ll[n];
    ll* range_right=new ll[n];
    range_left[0]=-1;
    for(int i=1; i<n; i++){
        int j=i-1;
        while((j>=0) && f[j]<f[i]) j=range_left[j];
        range_left[i]=j; 
    }
    range_right[n-1]=n;
    for(int i=n-2; i>=0; i--){
        int j=i+1;
        while((j<=n-1)&& f[j]<f[i]) j=range_right[j];
        range_right[i]=j;
    }
    for(int i=0; i<n; i++){
        range_left[i]=i-range_left[i];
        range_right[i]-=i;
    }
    for(int i=0; i<n; i++) cout<<(range_left[i])*(range_right[i])<<" ";
    ll count=0;
    int c=f[0];
    int p=0;
    for(int i=0; i<n; i++){
        if(f[i]!=c) break;
        p++;
    }
    if(p==n) cout<<"\n"<<ll(n*(n+1)/2)<<"\n";
    else{
    for(int i=0; i<n; i++){
        int max=f[i];
        for(int j=i; j<n; j++){
            if(f[j]<f[i]) break;
            if(f[j]>=max) {count++; max=f[j];}
        }
    }
    cout<<"\n"<<count<<"\n";
    }
}