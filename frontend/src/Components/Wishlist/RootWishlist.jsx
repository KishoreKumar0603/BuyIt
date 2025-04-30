import React from 'react'
import { Wishlist } from '../profileComponents/Wishlist'
export const RootWishlist = () => {
  useEffect(()=>{
        document.title=`BuyIt | Wishlists`;
      },[])
  return (
    <Wishlist />
  )
}