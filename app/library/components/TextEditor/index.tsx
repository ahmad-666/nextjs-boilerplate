//for get free api key we need to sign-in to tinymce
//docs at: https://www.tiny.cloud/docs/tinymce/6/react-cloud/
//if we need quick bar --> check https://www.tiny.cloud/docs/tinymce/6/quickbars/
//here we use controlled version of tinymce react component(using onInit,value,onEditorChange props) but if we face performance issues we can use uncontrolled version(using initialValue,onInit,onDirty props + separate button for submit editor value) ... check https://www.tiny.cloud/docs/tinymce/6/react-ref/#using-the-tinymce-react-component-as-a-uncontrolled-component
//we have many events as prop on Editor --> events for selection,insert,remove,copy/paste,focus,blue,dirty,...
//for many features first we need to add their plugin then add that feature inside menubar or toolbar e.g for image if we only add 'image' into toolbar,menubar without adding its plugin we don't see anything
//menubar is top of editor for file,view,inset,help,... and toolbar is bellow menubar for fontSize,color,italic,...
//by default editor uses 'pt' unit for font-size but here we change it to 'px' unit
//from 'blocks' toolbar if we select 'Header 1' it will add <h1> or for 'Header 3' it will add <h3> and so on ...
//tinymce create <iframe> <html><head></head><body></body></html></iframe> for body of editor inside our own page so using any of our own classes like tailwind classes won't work inside tinymce editor(iframe is only for body of editor and other parts like menubar,toolbar are normal div inside our page)

import { useRef, useMemo, useCallback } from "react";
import ClientOnly from "../ClientOnly";
import { Editor } from "@tinymce/tinymce-react";
import config from "../../config";
import type { Editor as EditorType } from "tinymce";
import "./styles.scss"; //use this file to style toolbar,menubar,... not effect editor body(iframe)

export type Menubar =
  | "file"
  | "edit"
  | "view"
  | "insert"
  | "format"
  | "tools"
  | "table"
  | "help";
export type Toolbar =
  | "undo"
  | "redo"
  | "accordion"
  | "accordionremove"
  | "blocks"
  | "fontfamily"
  | "fontsize"
  | "bold"
  | "italic"
  | "underline"
  | "strikethrough"
  | "align"
  | "numlist"
  | "bullist"
  | "link"
  | "image"
  | "table"
  | "media"
  | "lineheight"
  | "outdent"
  | "indent"
  | "forecolor"
  | "backcolor"
  | "removeformat"
  | "charmap"
  | "emoticons"
  | "code"
  | "fullscreen"
  | "preview"
  | "save"
  | "print"
  | "pagebreak"
  | "anchor"
  | "codesample"
  | "ltr"
  | "rtl";
export type Plugin =
  | "preview"
  | "importcss"
  | "searchreplace"
  | "autolink"
  | "autosave"
  | "save"
  | "directionality"
  | "code"
  | "visualblocks"
  | "visualchars"
  | "fullscreen"
  | "image"
  | "link"
  | "media"
  | "template"
  | "codesample"
  | "table"
  | "charmap"
  | "pagebreak"
  | "nonbreaking"
  | "anchor"
  | "insertdatetime"
  | "advlist"
  | "lists"
  | "wordcount"
  | "help"
  | "charmap"
  | "quickbars"
  | "emoticons"
  | "accordion";
export type Skin =
  | "material-classic"
  | "material-outline"
  | "bootstrap"
  | "fabric"
  | "fluent"
  | "borderless"
  | "small"
  | "jam"
  | "naked"
  | "outside"
  | "snow"
  | "oxide"
  | "oxide-dark";
export type Theme = "light" | "dark";
export type Icon = "bootstrap" | "material" | "small" | "jam" | "thin";
export type Lang = "en-US" | "fa";
export type Dir = "ltr" | "rtl";

type TextEditorProps = {
  value: string;
  onChange: (newVal: string) => void;
  placeholder?: string;
  lang?: Lang;
  dir?: Dir;
  skin?: Skin;
  theme?: Theme;
  icons?: Icon;
  autoSave?: boolean;
  autoSaveInterval?: number;
  menubar?: boolean | Menubar[];
  toolbar?: boolean | Toolbar[][];
  plugin?: Plugin[];
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  height?: number | string;
  minHeight?: number;
  maxHeight?: number;
  className?: string;
};

export default function TextEditor({
  value,
  onChange,
  placeholder = "Enter Content Here...",
  lang = "en-US", //for localize , it will change direction of menubar,toolbar,editor body too
  dir = "ltr", //only for direction of editor body itself and not include direction of menubar,toolbar
  autoSave = false, //if true when we try to refresh or unload it will ask if are sure we want to leave
  autoSaveInterval = 30, //30seconds
  skin = "oxide", //only affects menubar,toolbar and not editor body
  theme = "light", //only affect editor body
  icons,
  menubar = ["file", "edit", "view", "insert", "format", "table", "tools"], //true for default menubar, false for hide menubar , array like ['file','edit',...] for custom value
  toolbar = [
    ["undo", "redo"],
    ["blocks", "fontsize", "lineheight", "outdent", "indent"],
    ["bold", "italic", "underline", "strikethrough"],
    ["forecolor", "backcolor"],
    ["align"],
    ["link", "image", "emoticons"],
    ["numlist", "bullist"],
    ["fullscreen", "preview"],
  ], //true for default toolbar, false for hide toolbar , array like [['undo','redo'],['blocks'],...] for custom value
  plugin = [
    "image",
    "link",
    "table",
    "lists",
    "emoticons",
    "directionality",
    "fullscreen",
    "preview",
    "searchreplace",
    "autosave",
    "importcss",
  ],
  width = "100%",
  minWidth,
  maxWidth,
  height = 500,
  minHeight,
  maxHeight,
  className = "",
}: TextEditorProps) {
  const editorRef = useRef<EditorType>(null!); //editorRef for access to tinymce api --> editorRef.current.getContent()
  //if we check tinymce docs and we see it used 'tinymce' we could instead use this ref
  const menuBarNormalize = useMemo(() => {
    return typeof menubar === "boolean" ? menubar : menubar.join(" ");
  }, [menubar]);
  const toolbarNormalize = useMemo(() => {
    //if we pass [['undo','redo'],['blocks'],...] then we get 'undo redo | blocks'
    return typeof toolbar === "boolean"
      ? toolbar
      : toolbar.map((tool) => tool.join(" ")).join(" | ");
  }, [toolbar]);
  const pluginNormalize = useMemo(() => {
    //if we pass [['undo','redo'],['blocks'],...] then we get 'undo redo | blocks'
    return plugin.join(" ");
  }, [plugin]);
  const fontStyles = useMemo(() => {
    //0 index --> <h1>
    //1 index --> <h2>
    //2 index --> <h3>
    //3 index --> <h4>
    //4 index --> <h5>
    //5 index --> <h6>
    //6 index --> body1(use for <p>)
    const rootFontSize = 16; //if we pass 16px we get 16
    const { fontSize } = config;
    const { h1, h2, h3, h4, h5, h6, body1 } = fontSize;
    const results = [h1, h2, h3, h4, h5, h6, body1].map((font) => ({
      fontSize: `${parseFloat(font.fontSize) * rootFontSize}px`,
      fontWeight: `${font.fontWeight}`,
      lineHeight: `${parseFloat(font.lineHeight) * rootFontSize}px`,
      letterSpacing: `${parseFloat(font.letterSpacing) * rootFontSize}px`,
    }));
    return results;
  }, []);
  const fontSizes = useMemo(() => {
    return fontStyles.map((font) => font.fontSize).join(" ");
  }, [fontStyles]);
  const lineHeights = useMemo(() => {
    return fontStyles.map((font) => font.lineHeight).join(" ");
  }, [fontStyles]);
  const blockFormats = useMemo(() => {
    return {
      h1: {
        block: "h1", //create <h1> tag for Header 1
        styles: {
          fontSize: fontStyles[0].fontSize,
          fontWeight: fontStyles[0].fontWeight,
          lineHeight: fontStyles[0].lineHeight,
          letterSpacing: fontStyles[0].letterSpacing,
        },
        // classes: "text-h1",
      },
      h2: {
        block: "h2",
        styles: {
          fontSize: fontStyles[1].fontSize,
          fontWeight: fontStyles[1].fontWeight,
          lineHeight: fontStyles[1].lineHeight,
          letterSpacing: fontStyles[1].letterSpacing,
        },
      },
      h3: {
        block: "h3",
        styles: {
          fontSize: fontStyles[2].fontSize,
          fontWeight: fontStyles[2].fontWeight,
          lineHeight: fontStyles[2].lineHeight,
          letterSpacing: fontStyles[2].letterSpacing,
        },
      },
      h4: {
        block: "h4",
        styles: {
          fontSize: fontStyles[3].fontSize,
          fontWeight: fontStyles[3].fontWeight,
          lineHeight: fontStyles[3].lineHeight,
          letterSpacing: fontStyles[3].letterSpacing,
        },
      },
      h5: {
        block: "h5",
        styles: {
          fontSize: fontStyles[4].fontSize,
          fontWeight: fontStyles[4].fontWeight,
          lineHeight: fontStyles[4].lineHeight,
          letterSpacing: fontStyles[4].letterSpacing,
        },
      },
      h6: {
        block: "h6",
        styles: {
          fontSize: fontStyles[5].fontSize,
          fontWeight: fontStyles[5].fontWeight,
          lineHeight: fontStyles[5].lineHeight,
          letterSpacing: fontStyles[5].letterSpacing,
        },
      },
      p: {
        block: "p",
        styles: {
          fontSize: fontStyles[6].fontSize,
          fontWeight: fontStyles[6].fontWeight,
          lineHeight: fontStyles[6].lineHeight,
          letterSpacing: fontStyles[6].letterSpacing,
        },
      },
    };
  }, [fontStyles]);
  const onInit = useCallback((evt: any, editor: EditorType) => {
    editorRef.current = editor;
  }, []);
  const changeHandler = useCallback(
    (newValue: string, editor: EditorType) => {
      onChange(newValue);
    },
    [onChange]
  );
  return (
    <ClientOnly>
      <div className={`tinymce-editor ${className}`}>
        <Editor
          apiKey="zroo70p3px53wxwwf64ab14yepitcnuwtys90evpaogmxgo3"
          onInit={onInit}
          // initialValue={value}
          value={value}
          onEditorChange={changeHandler}
          init={{
            placeholder,
            language: lang,
            directionality: dir,
            width,
            min_width: minWidth,
            max_width: maxWidth,
            height,
            min_height: minHeight,
            max_height: maxHeight,
            skin,
            icons,
            indentation: "25px",
            font_size_formats: fontSizes,
            line_height_formats: lineHeights,
            // font_family_formats: "Roboto=roboto; YekanBakh=yekanBakh", //for show list of available fonts ... need 'fontfamily' in toolbar array , format is in 'Title1=font1; Title2=font2'
            formats: blockFormats,
            content_css: [theme === "dark" ? "dark" : ""],
            //we can create '.css' files inside 'public' folder and use content_css:['editor-1.css','editor2.css']
            //these styles will added to iframe that will be created via tinymce: (only affect body of editor not menubar,toolbar)
            //<iframe> <html> <head> <link rel="stylesheet" href="..." /> </head> </html> </iframe>
            content_style: `
              :root {
                font-size:16px;
              }
              @font-face {
                font-family: yekanBakh;
                src: url('/fonts/YekanBakhFaNumRegular.woff2') format('woff2');
              }
              @font-face {
                font-family: roboto;
                src: url('/fonts/Roboto-Regular.ttf') format('truetype');
              }
              * {
                font-family: roboto, yekanBakh;
              }
              h1,h2,h3,h4,h5,h6,p {
                padding:0;
                margin:0;
              }
            `,
            //these styles will added to iframe that will be created via tinymce:(only affect body of editor not menubar,toolbar)
            //<iframe> <html> <head> <styles of content_style will be append here> </head> </html> </iframe>
            importcss_append: true,
            menubar: menuBarNormalize, //for top of editor , things like file,view,insert,help,...
            toolbar: toolbarNormalize, //bellow menubar , things like font-size,color,undo,redo,...
            plugins: pluginNormalize,
            autosave_ask_before_unload: autoSave,
            autosave_interval: `${autoSaveInterval}s`,
            autosave_prefix: "{path}{query}-{id}-",
            image_caption: true,
            image_title: true, //show title input when we want to insert image
            automatic_uploads: true, // enable automatic uploads of images represented by blob or data URIs
            file_picker_types: "image",
            file_picker_callback: (cb, value, meta) => {
              //custom image picker
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");
              input.addEventListener("change", (e: any) => {
                const file = e.target?.files?.[0];
                const reader = new FileReader();
                reader.addEventListener("load", () => {
                  const id = "blobid" + new Date().getTime();
                  const blobCache = editorRef.current.editorUpload.blobCache;
                  const base64 = (reader.result as any)?.split(",")[1];
                  const blobInfo = blobCache.create(id, file, base64);
                  blobCache.add(blobInfo);
                  cb(blobInfo.blobUri(), { title: file.name });
                });
                reader.readAsDataURL(file);
              });
              input.click();
            },
          }}
        />
      </div>
    </ClientOnly>
  );
}
