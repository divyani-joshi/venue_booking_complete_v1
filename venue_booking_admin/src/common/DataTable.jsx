import React, { useState } from "react";
export default function DataTable({
  title,
  columns,
  data,
  loading,
  searchKeys = [],
  renderRow,
  headerAction,
  emptyMessage = "No data found",
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 7;
  const filtered = data.filter(
    (item) =>
      !search ||
      searchKeys.some((key) => {
        let v = item;
        for (const k of key.split(".")) v = v?.[k];
        return String(v || "")
          .toLowerCase()
          .includes(search.toLowerCase());
      }),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const rows = filtered.slice(start, start + perPage);
  return (
    <div className="card mb-4">
      <div className="card-header pb-0 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h6 className="mb-0">{title}</h6>
        <div className="d-flex gap-2 align-items-center flex-wrap">
          <div className="input-group input-group-sm" style={{ maxWidth: 180 }}>
            <span className="input-group-text">
              <i className="ni ni-zoom-split-in" />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          {headerAction}
        </div>
      </div>
      <div className="card-body px-0 pt-0 pb-2">
        <div className="table-responsive p-0">
          <table className="table align-items-center justify-content-center mb-0">
            <thead>
              <tr>
                <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                  #
                </th>
                {columns.map((c) => (
                  <th
                    key={c}
                    className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-5">
                    <div className="spinner-border text-primary spinner-border-sm me-2" />
                    <span className="text-secondary text-sm">Loading...</span>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="text-center py-5 text-secondary"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                rows.map((item, i) => renderRow(item, start + i + 1))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {!loading && filtered.length > 0 && (
        <div className="card-footer d-flex justify-content-between align-items-center py-2 px-3">
          <small className="text-muted">
            {start + 1}–{Math.min(start + perPage, filtered.length)} of{" "}
            {filtered.length}
          </small>
          <div className="d-flex gap-1">
            <button
              className="btn btn-sm btn-outline-secondary py-1 px-2"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <i className="ni ni-bold-left" />
            </button>
            {[...Array(Math.min(totalPages, 5))].map((_, i) => (
              <button
                key={i + 1}
                className={`btn btn-sm py-1 px-2 ${page === i + 1 ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="btn btn-sm btn-outline-secondary py-1 px-2"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              <i className="ni ni-bold-right" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
