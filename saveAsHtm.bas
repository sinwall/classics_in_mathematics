Attribute VB_Name = "NewMacros"
Sub saveAsHtm()
'
' saveAsHtm Macro
'
'
    Dim path    As String
    Dim oDoc    As Object
    
    Application.ScreenUpdating = False
'    Application.EnableEvents = False
    
    path = "C:\laboratory\classics_in_mathematics\.references\"
'ChangeFileOpenDirectory _
'        "C:\laboratory\classics_in_mathematics\.references\"
    myFile = Dir(path & "*.docx")
    Do While myFile <> ""
        Set oDoc = Documents.Open(FileName:=path & myFile)
        oDoc.SaveAs2 FileName:= _
            ActiveDocument.FullName & ".htm", FileFormat:=wdFormatHTML, _
            LockComments:=False, Password:="", AddToRecentFiles:=True, WritePassword _
            :="", ReadOnlyRecommended:=False, EmbedTrueTypeFonts:=False, _
            SaveNativePictureFormat:=False, SaveFormsData:=False, SaveAsAOCELetter:= _
            False, CompatibilityMode:=0
        
        oDoc.Close
        myFile = Dir
    Loop
    
    Application.ScreenUpdating = True
'    Application.EnableEvents = True
    
    

End Sub
