"use client";

import { useState } from "react";

// Product 型を定義
interface Product {
  product_name: string;
  product_price: number;
}

export default function CodeInput() {
  const [code, setCode] = useState<string>("");
  const [product, setProduct] = useState<Product | null>(null);
  const [purchaseList, setPurchaseList] = useState<Product[]>([]);

  // 環境変数の取得とバリデーション
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleReadCode = async () => {
    if (!API_URL) {
      console.error("API URL が設定されていません。");
      return;
    }
    if (!code) {
      console.warn("商品コードを入力してください。");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/product/${code}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`サーバーエラー: ${response.status}`);
      }

      const data = await response.json();
      if (!data.product_name || isNaN(Number(data.product_price))) {
        throw new Error("データのフォーマットが不正です。");
      }

      setProduct({
        product_name: data.product_name,
        product_price: Number(data.product_price),
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("商品情報の取得に失敗しました", error);
      } else {
        console.error("予期しないエラーが発生しました");
      }
      setProduct(null);
    }
  };

  const handleAddToList = () => {
    if (product) {
      setPurchaseList([...purchaseList, product]);
      setProduct(null);
      setCode("");
    }
  };

  const handlePurchase = () => {
    alert("購入が完了しました。");
    setPurchaseList([]);
  };

  return (
    <div className="p-4 bg-gray-100 w-80 border rounded-md shadow-lg ml-4">
      <div className="flex flex-col items-start">
        <input
          type="text"
          value={code}
          onChange={handleInputChange}
          className="border p-2 w-full text-lg text-left"
          placeholder="商品コードを入力"
        />
        <button
          onClick={handleReadCode}
          className="mt-2 bg-blue-300 text-black px-4 py-2 rounded w-full"
        >
          商品コード 読み込み
        </button>
      </div>

      {product && (
        <div className="mt-4 p-2 border w-full text-center bg-white rounded-md">
          <p className="text-lg font-semibold">{product.product_name}</p>
          <p className="text-gray-700">{product.product_price}円</p>
          <button
            onClick={handleAddToList}
            className="mt-2 bg-green-300 text-black px-4 py-2 rounded w-full"
          >
            追加
          </button>
        </div>
      )}

      {purchaseList.length > 0 && (
        <div className="mt-4 p-2 border w-full bg-white rounded-md">
          <p className="font-semibold">購入リスト</p>
          {purchaseList.map((item, index) => (
            <p key={index} className="text-gray-700">
              {item.product_name} x1 {item.product_price}円
            </p>
          ))}
          <button
            onClick={handlePurchase}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            購入
          </button>
        </div>
      )}
    </div>
  );
}
