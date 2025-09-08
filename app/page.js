'use client'
import { useState } from "react";

export default function Home() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    gifts: "",
    method: "",
    expectedDate: "",
    region: "",
    arrivalDate: "",
  });
  const [search, setSearch] = useState("");

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleAddCustomer = () => {
    if (!form.name) return;
    setCustomers([...customers, { ...form, id: Date.now() }]);
    setForm({
      name: "",
      gifts: "",
      method: "",
      expectedDate: "",
      region: "",
      arrivalDate: "",
    });
  };

  const filteredCustomers = customers.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.region.toLowerCase().includes(search.toLowerCase()) ||
      c.gifts.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h1 style={{ textAlign: "center" }}>🎁 고객 선물 관리</h1>
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="검색 (이름, 지역, 선물)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
      </div>
      <div style={{ marginBottom: 20 }}>
        <input placeholder="고객 이름" value={form.name} onChange={e => handleChange("name", e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 5 }}/>
        <input placeholder="선물 물품 (쉼표로 구분)" value={form.gifts} onChange={e => handleChange("gifts", e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 5 }}/>
        <input placeholder="수령 방식" value={form.method} onChange={e => handleChange("method", e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 5 }}/>
        <input type="date" placeholder="수령 예상 일자" value={form.expectedDate} onChange={e => handleChange("expectedDate", e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 5 }}/>
        <input placeholder="수령 지역" value={form.region} onChange={e => handleChange("region", e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 5 }}/>
        <input type="date" placeholder="주문 상품 도착 예정일" value={form.arrivalDate} onChange={e => handleChange("arrivalDate", e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 5 }}/>
        <button onClick={handleAddCustomer} style={{ width: "100%", padding: 10, backgroundColor: "#4caf50", color: "white", border: "none", marginTop: 5 }}>등록하기</button>
      </div>

      <div>
        {filteredCustomers.map(c => (
          <div key={c.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
            <p><strong>이름:</strong> {c.name}</p>
            <p><strong>선물:</strong> {c.gifts}</p>
            <p><strong>수령 방식:</strong> {c.method}</p>
            <p><strong>주문 상품 도착 예상일:</strong> {c.expectedDate}</p>
            <p><strong>지역:</strong> {c.region}</p>
            <p><strong>상품 전달 예정일:</strong> {c.arrivalDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}