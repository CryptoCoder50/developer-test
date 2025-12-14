import React, { useEffect, useState, useCallback } from "react";

export default function TechnicalAssessmentWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch("/api/technical_assessment", {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store", // ensure fresh data
      });

      const text = await res.text();

      let json;
      try {
        json = JSON.parse(text);
      } catch (e) {
        throw new Error("Expected JSON but got: " + text.slice(0, 30));
      }

      if (!res.ok) {
        throw new Error((json && json.error) ? json.error : "Request failed (" + res.status + ")");
      }

      setData(json);
    } catch (e) {
      setErr(e && e.message ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    let alive = true;

    (async () => {
      if (!alive) return;
      await fetchData();
    })();

    return function cleanup() {
      alive = false;
    };
  }, [fetchData]);

  // Auto-retry a few times if initial load fails (backend boot timing)
  useEffect(() => {
    if (!err) return;
    if (retryCount >= 5) return;

    const delayMs = 1000 + retryCount * 1000; // 1s, 2s, 3s, 4s, 5s
    const t = setTimeout(async () => {
      setRetryCount(function (n) { return n + 1; });
      await fetchData();
    }, delayMs);

    return () => clearTimeout(t);
  }, [err, retryCount, fetchData]);

  // OPTIONAL: refresh automatically every 30 seconds (uncomment if you want)
  // useEffect(() => {
  //   const t = setInterval(() => fetchData(), 30000);
  //   return () => clearInterval(t);
  // }, [fetchData]);

  // Safe getters without optional chaining for compatibility
  const chainName = data && data.chain && data.chain.name ? data.chain.name : "N/A";
  const chainId =
    data && data.chain && (data.chain.chainId === 0 || data.chain.chainId)
      ? data.chain.chainId
      : "N/A";

  const latestBlock =
    data && (data.rpcBlockNumber === 0 || data.rpcBlockNumber)
      ? data.rpcBlockNumber
      : null;

  return (
    <section style={{ marginTop: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ marginBottom: 12 }}>Technical Assessment</h2>

        <button
          type="button"
          onClick={fetchData}
          style={{
            border: "1px solid #ddd",
            borderRadius: 6,
            padding: "6px 10px",
            background: "white",
            cursor: "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
        {loading ? <div>Loading contract information…</div> : null}

        {!loading && err ? (
          <div style={{ color: "#b00020" }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Failed to load</div>
            <div>{err}</div>
            <div style={{ marginTop: 8, fontSize: 12, opacity: 0.85 }}>
              Auto-retry: {retryCount}/5
            </div>
          </div>
        ) : null}

        {!loading && !err && data ? (
          <div>
            <div style={{ marginBottom: 6 }}>
              <strong>Address:</strong>{" "}
              {data.address ? data.address : "N/A"}
            </div>

            <div style={{ marginBottom: 6 }}>
              <strong>Creator:</strong>{" "}
              {data.creator ? data.creator : "N/A"}
            </div>

            <div style={{ marginBottom: 6 }}>
              <strong>Deployment Timestamp:</strong>{" "}
              {data.deploymentTimestamp ? data.deploymentTimestamp : "N/A"}
            </div>

            <div style={{ marginBottom: 6 }}>
              <strong>Network:</strong> {chainName} (Chain ID: {chainId})
            </div>

            <div style={{ marginBottom: 6 }}>
              <strong>Latest Block:</strong>{" "}
              {latestBlock !== null ? latestBlock : "N/A"}
            </div>

            <div>
              <strong>RPC Timestamp:</strong>{" "}
              {data.rpcTimestamp ? data.rpcTimestamp : "N/A"}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}