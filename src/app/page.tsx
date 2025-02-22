"use client";

import { useState } from "react";

// Product 型を定義 (修正点)
type Product = {
  product_name: string;
  product_price: number; // 整数型
};

export default function CodeInput() {
  const [code, setCode] = useState<string>("");
  const [product, setProduct] = useState<Product | null>(null);

  // 環境変数から API エンドポイントを取得
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  // 環境変数から API エンドポイントを取得
  console.log("API_URL:", API_URL);

  const handleReadCode = async () => {
    if (!API_URL) {
      console.error("API URL が設定されていません。");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/product/${code}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`サーバーエラー: ${response.status}`);
      }

      const data = await response.json();

      if (!data.product_name || isNaN(Number(data.product_price))) {
        throw new Error("データのフォーマットが不正です。");
      }

      // product_price を数値型 (number) に変換してセット (修正点)
      const formattedData: Product = {
        product_name: data.product_name,
        product_price: Number(data.product_price), // 数値型に変換
      };

      setProduct(formattedData);
    } catch (error) {
      if (error instanceof Error) {
        console.error("商品情報の取得に失敗しました", error.message);
      } else {
        console.error("予期ないしないエラーが発生しました");
      }
      setProduct(null);
    }
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
        </div>
      )}
    </div>
  );
}
