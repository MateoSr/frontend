import './inputForum.css'

function InputForum({label,id,type,value,onChange,placeholder,required,name,autoComplete = "off",readOnly="false"}){
    return(
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <input 
            type={type} 
            id={id} 
            name={name || id}
            autoComplete= {autoComplete}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            readOnly={readOnly}
            />
    </div>

)}

export default InputForum