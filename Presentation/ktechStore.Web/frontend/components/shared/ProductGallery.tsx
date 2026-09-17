"use client";

import { useState } from "react";
import type { Product } from "@/types/Product";
import { formatPrice, getProductEmoji } from "@/lib/utils";

export default function ProductGallery({ product }: { product: Product }) {
    const [mainImage, setMainImage] = useState(product.imageUrl);
    const [thumbnailList, setThumbnailList] = useState<string[]>(
        product.productDetails
            .map(d => d.imageUrl)
            .filter((url): url is string => Boolean(url))
    );

    const setImageMain = (clickedImage: string, clickedIndex: number) => {
        const oldMainImage = mainImage;
        setMainImage(clickedImage);
        setThumbnailList(prevList => {
            const newList = [...prevList];
            newList[clickedIndex] = oldMainImage;
            return newList;
        });
    };

    return (
        <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-primary-light to-white rounded-2xl flex items-center justify-center relative">
                {mainImage ? (
                    <img src={mainImage} alt="Product image" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-[10rem] md:text-[14rem]">{getProductEmoji(product.category)}</span>
                )}
                {product.discount && (
                    <span className="absolute top-4 left-4 bg-accent text-white text-sm font-bold px-3 py-1.5 rounded-lg">
                        -{product.discount}% OFF
                    </span>
                )}
            </div>

            {product.productDetails.some(d => d.imageUrl) && (
                <div className="flex gap-3 overflow-x-auto">
                    {thumbnailList.map((imgUrl, index) => (
                        <img
                            key={index}
                            src={imgUrl}
                            alt="Variant"
                            onClick={() => setImageMain(imgUrl, index)}
                            className="w-16 h-16 rounded-lg object-cover border border-border flex-shrink-0 cursor-pointer hover:border-primary transition-colors"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}