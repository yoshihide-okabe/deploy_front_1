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
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 flex">
        {/* 左側 (商品入力) */}
        <div className="w-1/2 pr-4 border-r">
          <input
            type="text"
            value={code}
            onChange={handleInputChange}
            className="border p-2 w-full text-lg text-left"
            placeholder="商品コードを入力"
          />
          <button
            onClick={handleReadCode}
            className="mt-2 bg-white text-black border px-4 py-2 rounded w-full"
          >
            商品コード 読み込み
          </button>

          {product && (
            <>
              <input
                type="text"
                className="border p-2 w-full mb-2"
                value={product.product_name}
                readOnly
              />
              <input
                type="text"
                className="border p-2 w-full mb-2"
                value={`${product.product_price}円`}
                readOnly
              />
              <button
                className="bg-blue-700 text-white w-full p-2"
                onClick={handleAddToList}
              >
                追加
              </button>
            </>
          )}
        </div>

        {/* 右側 (購入リスト) */}
        <div className="w-1/2 pl-4">
          <h2 className="text-lg font-bold mb-2">購入リスト</h2>
          <div className="border p-4 h-40 overflow-auto mb-4">
            <ul>
              {purchaseList.map((item, index) => (
                <li key={index} className="border-b py-1">
                  {item.product_name} x1 {item.product_price}円
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={handlePurchase}
            className="mt-2 bg-white text-black border px-4 py-2 rounded w-full"
          >
            購入
          </button>
        </div>
      </div>
    </div>
  );
}
