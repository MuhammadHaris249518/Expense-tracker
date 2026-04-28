import { useState } from 'react';
import '../index.css';
import '../App.css';
import axios from 'axios';
import { z } from "zod";

const transactionSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  category: z.string().nonempty("Category is required"),
  date: z.string().nonempty("Date is required"),
  choice: z.enum(["Expense", "Income"])
});

function Form({ sendData }: { sendData: (data: unknown) => void }) {
  const [formdata, setFormdata] = useState({
    title: "",
    category: "food",
    date: new Date().toISOString().split('T')[0],
    amount: "",
    choice: "Expense"
  });
  
  const [fieldErrors, setFieldErrors] = useState<{ title?: string; amount?: string; category?: string; date?: string; choice?: string }>({});

  const changehandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormdata({
      ...formdata,
      [e.target.name]: e.target.value
    });
  };

  const setChoice = (choice: string) => {
    setFormdata({ ...formdata, choice });
  };

  function sendformtodb() {
    const validation = transactionSchema.safeParse(formdata);
    
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setFieldErrors(errors);
      return;
    }
    
    setFieldErrors({});

    axios.post(`${import.meta.env.VITE_API_BASE_URL}/transactions`, formdata, {
      withCredentials: true
    }).then((res) => {
      console.log("response from server", res.data);
      if (res.data.success) {
        sendData(formdata);
        // Reset form
        setFormdata({
          title: "",
          category: "food",
          date: new Date().toISOString().split('T')[0],
          amount: "",
          choice: "Expense"
        });
      }
    }).catch((error) => console.error("error sending data", error));
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h3>Add Transaction</h3>

      <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
        <button
          type="button"
          onClick={() => setChoice("Expense")}
          className={`btn-toggle ${formdata.choice === 'Expense' ? 'active' : ''}`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => setChoice("Income")}
          className={`btn-toggle ${formdata.choice === 'Income' ? 'active' : ''}`}
        >
          Income
        </button>
      </div>

      <div className="form-group">
        <label className="label-text">Title</label>
        <input
          className="input-field"
          type="text"
          name="title"
          placeholder="e.g. Groceries"
          value={formdata.title}
          onChange={changehandler}
        />
        {fieldErrors.title && <span style={{ color: "var(--error)", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>{fieldErrors.title}</span>}
      </div>

      <div className="form-group">
        <label className="label-text">Amount</label>
        <input
          className="input-field"
          type="number"
          name="amount"
          placeholder="0.00"
          value={formdata.amount}
          onChange={changehandler}
        />
        {fieldErrors.amount && <span style={{ color: "var(--error)", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>{fieldErrors.amount}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="label-text">Category</label>
          <select name="category" className="input-field" value={formdata.category} onChange={changehandler}>
            <option value="food">Food</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Health">Health</option>
          </select>
          {fieldErrors.category && <span style={{ color: "var(--error)", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>{fieldErrors.category}</span>}
        </div>

        <div className="form-group">
          <label className="label-text">Date</label>
          <input
            type="date"
            name="date"
            className="input-field"
            value={formdata.date}
            onChange={changehandler}
          />
          {fieldErrors.date && <span style={{ color: "var(--error)", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>{fieldErrors.date}</span>}
        </div>
      </div>

      <button
        type="button"
        onClick={sendformtodb}
        className="btn-primary"
        style={{ marginTop: '1rem' }}
      >
        Add Transaction
      </button>
    </form>
  );
}

export default Form;