import React from 'react'
import { Wishlist } from '../profileComponents/Wishlist';
import { useEffect } from 'react';
export const RootWishlist = () => {
  useEffect(()=>{
        document.title=`BuyIt | Wishlists`;
      },[])
  return (
    <Wishlist />
  )
}