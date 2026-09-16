import './inputForum.css'
function InputForum({ label, id, type, value, onChange, placeholder, required, name, autoComplete = "off", readOnly = false, options = [], style }) {
    return (
        <div className="form-group" style={style}>
            <label htmlFor={id}>{label}</label>

            {type === 'select' ? (
                <select
                    id={id}
                    name={name || id}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className="select-form"
                >
                    <option value="" disabled hidden>
                        {placeholder || "Selecciona una opción"}
                    </option>
                    {options && options.map((opt, index) => (
                        <option key={index} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    id={id}
                    name={name || id}
                    autoComplete={autoComplete}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    readOnly={readOnly}
                />
            )}
        </div>
    );
}

export default InputForum;