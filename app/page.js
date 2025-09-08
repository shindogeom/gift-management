"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient"; // supabaseClient.js는 lib 폴더에 생성되어 있어야 합니다.

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    gifts: "",
    method: "",
    giftExpectedDate: "",
    region: "",
    deliveryExpectedDate: "",
  });
  const [search, setSearch] = useState("");

  // 로그인 상태는 LocalStorage 유지
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === "true") setIsLoggedIn(true);
    if (loggedIn === "true") fetchCustomers();
  }, []);

  // Supabase에서 고객 데이터 가져오기
  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("id", { ascending: true });
    if (error) console.error("데이터 불러오기 오류:", error);
    else setCustomers(data);
  };

  // 로그인 처리
  const handleLogin = () => {
    if (usernameInput === "csw123" && passwordInput === "csw123") {
      localStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
      alert("로그인 성공!");
      fetchCustomers();
    } else {
      alert("아이디 또는 비밀번호가 틀렸습니다.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  // 신규 등록
  const handleAddCustomer = async () => {
    if (!form.name || !form.deliveryExpectedDate) {
      alert("이름과 전달 예상일은 필수입니다.");
      return;
    }

    const { data, error } = await supabase.from("customers").insert([form]);
    if (error) {
      console.error("등록 오류:", error);
    } else {
      setForm({
        name: "",
        gifts: "",
        method: "",
        giftExpectedDate: "",
        region: "",
        deliveryExpectedDate: "",
      });
      fetchCustomers();
    }
  };

  // 삭제
  const handleDelete = async (id) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const { error } = await supabase.from("customers").delete().eq("id", id);
    if (error) console.error("삭제 오류:", error);
    else fetchCustomers();
  };

  // 편집 모드 토글
  const toggleEdit = (id) => {
    const updated = customers.map((c) =>
      c.id === id ? { ...c, isEditing: !c.isEditing } : c
    );
    setCustomers(updated);
  };

  const handleEditChange = (id, key, value) => {
    const updated = customers.map((c) =>
      c.id === id ? { ...c, [key]: value } : c
    );
    setCustomers(updated);
  };

  // 저장
  const handleSave = async (id) => {
    const customer = customers.find((c) => c.id === id);
    const { error } = await supabase
      .from("customers")
      .update({
        name: customer.name,
        gifts: customer.gifts,
        method: customer.method,
        giftExpectedDate: customer.giftExpectedDate,
        region: customer.region,
        deliveryExpectedDate: customer.deliveryExpectedDate,
      })
      .eq("id", id);
    if (error) console.error("수정 오류:", error);
    else toggleEdit(id);
  };

  // 검색
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.region.toLowerCase().includes(search.toLowerCase()) ||
      c.gifts.toLowerCase().includes(search.toLowerCase())
  );

  // 로그인 화면
  if (!isLoggedIn) {
    return (
      <div style={{ maxWidth: 400, margin: "50px auto" }}>
        <h2>로그인</h2>
        <input
          placeholder="아이디"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <button
          onClick={handleLogin}
          style={{ width: "100%", padding: 10 }}
        >
          로그인
        </button>
      </div>
    );
  }

  // 메인 화면
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <button onClick={handleLogout} style={{ marginBottom: 20 }}>
        로그아웃
      </button>
      <h1 style={{ textAlign: "center" }}>🎁 고객 선물 관리</h1>

      {/* 검색 */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="검색 (이름, 지역, 선물)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
      </div>

      {/* 등록 폼 */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="고객 이름"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 5 }}
        />
        <input
          placeholder="선물 물품 (쉼표로 구분)"
          value={form.gifts}
          onChange={(e) => handleChange("gifts", e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 5 }}
        />
        <input
          placeholder="수령 방식"
          value={form.method}
          onChange={(e) => handleChange("method", e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 5 }}
        />
        <div style={{ fontSize: 12, color: "#555", marginBottom: 2 }}>
          선택: 물품 수령 예상일 (입력하지 않아도 등록 가능)
        </div>
        <input
          type="date"
          value={form.giftExpectedDate}
          onChange={(e) => handleChange("giftExpectedDate", e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 5 }}
        />
        <input
          placeholder="수령 지역"
          value={form.region}
          onChange={(e) => handleChange("region", e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 5 }}
        />
        <div style={{ fontSize: 12, color: "#555", marginBottom: 2 }}>
          필수: 전달 예상일
        </div>
        <input
          type="date"
          value={form.deliveryExpectedDate}
          onChange={(e) => handleChange("deliveryExpectedDate", e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 5 }}
        />
        <button
          onClick={handleAddCustomer}
          style={{
            width: "100%",
            padding: 10,
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            marginTop: 5,
          }}
        >
          등록하기
        </button>
      </div>

      {/* 고객 리스트 */}
      <div>
        {filteredCustomers.map((c) => (
          <div
            key={c.id}
            style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}
          >
            {c.isEditing ? (
              <div>
                <input
                  value={c.name}
                  onChange={(e) => handleEditChange(c.id, "name", e.target.value)}
                  style={{ width: "100%", marginBottom: 5 }}
                />
                <input
                  value={c.gifts}
                  onChange={(e) => handleEditChange(c.id, "gifts", e.target.value)}
                  style={{ width: "100%", marginBottom: 5 }}
                />
                <input
                  value={c.method}
                  onChange={(e) => handleEditChange(c.id, "method", e.target.value)}
                  style={{ width: "100%", marginBottom: 5 }}
                />
                <div style={{ fontSize: 12, color: "#555", marginBottom: 2 }}>
                  선택: 물품 수령 예상일
                </div>
                <input
                  type="date"
                  value={c.giftExpectedDate}
                  onChange={(e) => handleEditChange(c.id, "giftExpectedDate", e.target.value)}
                  style={{ width: "100%", marginBottom: 5 }}
                />
                <input
                  value={c.region}
                  onChange={(e) => handleEditChange(c.id, "region", e.target.value)}
                  style={{ width: "100%", marginBottom: 5 }}
                />
                <div style={{ fontSize: 12, color: "#555", marginBottom: 2 }}>
                  필수: 전달 예상일
                </div>
                <input
                  type="date"
                  value={c.deliveryExpectedDate}
                  onChange={(e) => handleEditChange(c.id, "deliveryExpectedDate", e.target.value)}
                  style={{ width: "100%", marginBottom: 5 }}
                />
                <button
                  onClick={() => handleSave(c.id)}
                  style={{ marginRight: 5, backgroundColor: "#2196F3", color: "white", padding: 5 }}
                >
                  저장
                </button>
                <button onClick={() => toggleEdit(c.id)} style={{ padding: 5 }}>
                  취소
                </button>
              </div>
            ) : (
              <div>
                <p><strong>이름:</strong> {c.name}</p>
                <p><strong>선물:</strong> {c.gifts}</p>
                <p><strong>수령 방식:</strong> {c.method}</p>
                <p><strong>물품 수령 예상일:</strong> {c.giftExpectedDate || "입력 없음"}</p>
                <p><strong>지역:</strong> {c.region}</p>
                <p><strong>전달 예상일:</strong> {c.deliveryExpectedDate}</p>
                <button onClick={() => toggleEdit(c.id)} style={{ marginRight: 5 }}>
                  수정
                </button>
                <button onClick={() => handleDelete(c.id)}>삭제</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
