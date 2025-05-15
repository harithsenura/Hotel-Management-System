"use client"

import { useState } from "react"
import axios from "axios"
import { getUser } from "../../services/userService"

const ApiDiagnostic = () => {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

  const runDiagnostics = async () => {
    try {
      setLoading(true)
      setResults(null)

      const user = getUser()
      const userId = user?._id || user?.id
      const diagnosticResults = {
        timestamp: new Date().toISOString(),
        user: userId ? { id: userId } : "Not logged in",
        tests: [],
      }

      // Test 1: Server health check
      try {
        const healthResponse = await axios.get("http://localhost:5001/api/health", { timeout: 5000 })
        diagnosticResults.tests.push({
          name: "Server Health",
          status: "success",
          data: healthResponse.data,
        })
      } catch (err) {
        diagnosticResults.tests.push({
          name: "Server Health",
          status: "failed",
          error: err.message,
        })
      }

      // Test 2: Get all gifts
      try {
        const giftsResponse = await axios.get("http://localhost:5001/gifts", { timeout: 5000 })
        diagnosticResults.tests.push({
          name: "Gifts API",
          status: "success",
          count: giftsResponse.data?.data?.length || 0,
        })
      } catch (err) {
        diagnosticResults.tests.push({
          name: "Gifts API",
          status: "failed",
          error: err.message,
        })
      }

      // Test 3: Get all gift orders
      try {
        const ordersResponse = await axios.get("http://localhost:5001/gift-orders", { timeout: 5000 })
        diagnosticResults.tests.push({
          name: "All Gift Orders API",
          status: "success",
          count: ordersResponse.data?.data?.length || 0,
        })
      } catch (err) {
        diagnosticResults.tests.push({
          name: "All Gift Orders API",
          status: "failed",
          error: err.message,
        })
      }

      // Test 4: Get user gift orders (if logged in)
      if (userId) {
        try {
          const userOrdersResponse = await axios.get(`http://localhost:5001/gift-orders/user/${userId}`, {
            timeout: 5000,
          })
          diagnosticResults.tests.push({
            name: "User Gift Orders API",
            status: "success",
            count: userOrdersResponse.data?.data?.length || 0,
          })
        } catch (err) {
          diagnosticResults.tests.push({
            name: "User Gift Orders API",
            status: "failed",
            error: err.message,
          })
        }
      }

      setResults(diagnosticResults)
    } catch (error) {
      console.error("Error running diagnostics:", error)
      setResults({
        timestamp: new Date().toISOString(),
        error: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="api-diagnostic-container">
      <h3>API Diagnostics</h3>
      <button onClick={runDiagnostics} disabled={loading} className="diagnostic-button">
        {loading ? "Running Diagnostics..." : "Run API Diagnostics"}
      </button>

      {results && (
        <div className="diagnostic-results">
          <h4>Results ({new Date(results.timestamp).toLocaleTimeString()})</h4>

          {results.error ? (
            <div className="diagnostic-error">
              <p>Error running diagnostics: {results.error}</p>
            </div>
          ) : (
            <>
              <div className="user-info">
                <strong>User:</strong> {results.user === "Not logged in" ? "Not logged in" : results.user.id}
              </div>

              <div className="tests-container">
                {results.tests.map((test, index) => (
                  <div key={index} className={`test-result ${test.status}`}>
                    <div className="test-header">
                      <span className="test-name">{test.name}</span>
                      <span className={`test-status ${test.status}`}>
                        {test.status === "success" ? "✓ Success" : "✗ Failed"}
                      </span>
                    </div>
                    <div className="test-details">
                      {test.status === "success" ? (
                        test.count !== undefined ? (
                          <span>Found {test.count} items</span>
                        ) : (
                          <pre>{JSON.stringify(test.data, null, 2)}</pre>
                        )
                      ) : (
                        <span className="error-message">{test.error}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="diagnostic-summary">
                <p>
                  <strong>Summary:</strong> {results.tests.filter((t) => t.status === "success").length} of{" "}
                  {results.tests.length} tests passed
                </p>
                {results.tests.some((t) => t.status === "failed") && (
                  <p className="troubleshooting-tips">
                    <strong>Troubleshooting Tips:</strong>
                    <br />
                    1. Check if the server is running
                    <br />
                    2. Verify MongoDB connection
                    <br />
                    3. Check for errors in server logs
                    <br />
                    4. Ensure all routes are properly registered
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        .api-diagnostic-container {
          margin-top: 2rem;
          padding: 1.5rem;
          background-color: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }
        
        .api-diagnostic-container h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #333;
        }
        
        .diagnostic-button {
          background-color: #6366f1;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .diagnostic-button:hover {
          background-color: #4f46e5;
        }
        
        .diagnostic-button:disabled {
          background-color: #a5a6f6;
          cursor: not-allowed;
        }
        
        .diagnostic-results {
          margin-top: 1.5rem;
          padding: 1rem;
          background-color: white;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }
        
        .diagnostic-results h4 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #333;
          border-bottom: 1px solid #e9ecef;
          padding-bottom: 0.5rem;
        }
        
        .user-info {
          margin-bottom: 1rem;
          padding: 0.5rem;
          background-color: #f8f9fa;
          border-radius: 4px;
        }
        
        .tests-container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .test-result {
          padding: 0.75rem;
          border-radius: 6px;
          border: 1px solid #e9ecef;
        }
        
        .test-result.success {
          background-color: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.3);
        }
        
        .test-result.failed {
          background-color: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
        }
        
        .test-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .test-name {
          font-weight: 600;
        }
        
        .test-status {
          font-size: 0.85rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }
        
        .test-status.success {
          background-color: rgba(16, 185, 129, 0.2);
          color: #065f46;
        }
        
        .test-status.failed {
          background-color: rgba(239, 68, 68, 0.2);
          color: #b91c1c;
        }
        
        .test-details {
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }
        
        .error-message {
          color: #b91c1c;
        }
        
        .diagnostic-summary {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #e9ecef;
        }
        
        .troubleshooting-tips {
          margin-top: 0.5rem;
          padding: 0.75rem;
          background-color: #fffbeb;
          border-radius: 6px;
          border-left: 4px solid #f59e0b;
          font-size: 0.9rem;
          line-height: 1.5;
        }
        
        pre {
          background-color: #f8f9fa;
          padding: 0.5rem;
          border-radius: 4px;
          overflow-x: auto;
          font-size: 0.8rem;
          margin: 0;
        }
      `}</style>
    </div>
  )
}

export default ApiDiagnostic
